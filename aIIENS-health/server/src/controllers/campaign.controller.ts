import { Request, Response, NextFunction } from 'express';
import { Campaign } from '../models/Campaign.model';
import { PatientCase } from '../models/PatientCase.model';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';

export const getCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search, 
      category, 
      urgency 
    } = req.query;

    const query: any = { status: 'active' };

    if (search) {
      query.$text = { $search: search as string };
    }

    // Since category and urgency live on PatientCase, we must first find matching cases
    // if filters are provided, or we can use populate match filtering.
    // However, Mongoose populate match filtering doesn't filter the parent document natively.
    // Instead, let's find matching PatientCases first and filter campaigns by those case IDs.
    
    let caseQuery: any = {};
    if (category) caseQuery.diagnosisCategory = category;
    if (urgency) caseQuery.urgency = urgency;

    if (Object.keys(caseQuery).length > 0) {
      // Find case IDs that match the criteria
      const matchingCases = await PatientCase.find(caseQuery).select('_id');
      const caseIds = matchingCases.map(c => c._id);
      
      // Add to campaign query
      query.caseId = { $in: caseIds };
    }

    const total = await Campaign.countDocuments(query);
    
    let sortOptions: any = { publishedAt: -1 }; // default newest
    if (search) sortOptions = { score: { $meta: 'textScore' } };

    const campaigns = await Campaign.find(query)
      .sort(sortOptions)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate({
        path: 'caseId',
        select: 'patientName patientAge patientGender diagnosisCategory diagnosisDescription urgency hospitalId costBreakdown',
        populate: {
          path: 'hospitalId',
          model: 'Hospital',
          select: 'name address'
        }
      });

    // We must manually strip out the name to make it safe if required, 
    // but the prompt allows "safe patient identifier". We will just use the first name.
    const safeCampaigns = campaigns.map(c => {
      const doc = c.toObject();
      const pc = doc.caseId as any;
      if (pc && pc.patientName) {
        // Safe identifier: First name and initial
        const parts = pc.patientName.split(' ');
        pc.patientName = parts[0] + (parts[1] ? ` ${parts[1][0]}.` : '');
      }
      return doc;
    });

    sendSuccess(res, {
      statusCode: 200,
      message: 'Campaigns retrieved successfully',
      data: safeCampaigns,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        hasNextPage: Number(page) < Math.ceil(total / Number(limit)),
        hasPrevPage: Number(page) > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCampaignDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    
    const campaign = await Campaign.findOne({ slug, status: 'active' })
      .populate({
        path: 'caseId',
        select: 'patientName patientAge patientGender diagnosisCategory diagnosisDescription urgency hospitalId costBreakdown',
        populate: {
          path: 'hospitalId',
          model: 'Hospital',
          select: 'name address'
        }
      });

    if (!campaign) {
      throw new AppError('Campaign not found or is not active', 404);
    }

    const doc = campaign.toObject();
    const pc = doc.caseId as any;
    if (pc && pc.patientName) {
      const parts = pc.patientName.split(' ');
      pc.patientName = parts[0] + (parts[1] ? ` ${parts[1][0]}.` : '');
    }

    sendSuccess(res, {
      statusCode: 200,
      message: 'Campaign details retrieved',
      data: doc
    });
  } catch (error) {
    next(error);
  }
};
