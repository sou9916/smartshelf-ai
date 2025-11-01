import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    category: { type: String, enum: ['grocery', 'medicine', 'cosmetic', 'beverage', 'other'], default: 'grocery' },
    dosage: { type: String }, // optional for medicines
    expiryDate: { type: Date, required: true },
    reminderTime: { type: Date },
    barcode: { type: String },
    status: { type: String, enum: ['active', 'expired', 'consumed'], default: 'active' },
    estimatedCost: { type: Number }, // for gamification
    consumedAt: { type: Date }
  },
  { timestamps: true }
)

itemSchema.pre('save', function (next) {
  if (this.expiryDate && new Date(this.expiryDate) < new Date()) {
    this.status = 'expired'
  } else if (this.status !== 'consumed') {
    this.status = 'active'
  }
  next()
})

export default mongoose.model('Item', itemSchema)
