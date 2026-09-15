import { Schema, model, Document, Types } from 'mongoose';

export interface IImpactMetric extends Document {
  _id: Types.ObjectId;
  metricKey: string;
  value: number;
  periodStart: Date;
  periodEnd: Date;
  calculatedAt: Date;
  calculationVersion: number;
  source: string;
  status: 'current' | 'stale' | 'error';
}

const ImpactMetricSchema = new Schema<IImpactMetric>(
  {
    metricKey: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    periodStart: {
      type: Date,
      required: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    calculatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    calculationVersion: {
      type: Number,
      required: true,
      default: 1,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['current', 'stale', 'error'],
      default: 'current',
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'impact_metrics',
  },
);

ImpactMetricSchema.index({ metricKey: 1, periodEnd: -1 });
ImpactMetricSchema.index({ status: 1, calculatedAt: -1 });

export const ImpactMetric = model<IImpactMetric>('ImpactMetric', ImpactMetricSchema);
