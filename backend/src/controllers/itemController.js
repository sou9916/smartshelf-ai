import Item from '../models/Item.js'
import Notification from '../models/Notification.js'
import { sendEmail } from '../utils/mailer.js'
import { sendPushToAll } from '../utils/push.js'

const daysBetween = (a, b) => Math.ceil((b - a) / (1000 * 60 * 60 * 24))

export async function addItem(req, res, next) {
  try {
    const { name, category, dosage, expiryDate, reminderTime, barcode, estimatedCost } = req.body
    if (!name || !expiryDate) return res.status(400).json({ error: 'Name and expiryDate required' })
    const item = await Item.create({
      userId: req.user.id,
      name,
      category,
      dosage,
      expiryDate,
      reminderTime,
      barcode,
      estimatedCost
    })

    // Auto-notification if expiry < 3 days
    const d = daysBetween(new Date(), new Date(expiryDate))
    if (d <= 3 && d >= 0) {
      const title = 'Expiring soon'
      const message = `${name} expires in ${d} day(s).`
      await Notification.create({ userId: req.user.id, itemId: item._id, title, message, type: 'email' })
      sendEmail(req.user.email, title, message).catch(() => {})
      sendPushToAll(title, message).catch(() => {})
    }

    res.json(item)
  } catch (err) {
    next(err)
  }
}

export async function getItems(req, res, next) {
  try {
    const items = await Item.find({ userId: req.user.id }).sort({ expiryDate: 1 })
    res.json(items)
  } catch (err) {
    next(err)
  }
}

export async function updateItem(req, res, next) {
  try {
    const id = req.params.id
    const update = req.body
    const item = await Item.findOneAndUpdate({ _id: id, userId: req.user.id }, update, { new: true })
    if (!item) return res.status(404).json({ error: 'Item not found' })

    const d = daysBetween(new Date(), new Date(item.expiryDate))
    if (d <= 3 && d >= 0) {
      const title = 'Updated item expiring soon'
      const message = `${item.name} expires in ${d} day(s).`
      await Notification.create({ userId: req.user.id, itemId: item._id, title, message, type: 'push' })
      sendPushToAll(title, message).catch(() => {})
    }

    res.json(item)
  } catch (err) {
    next(err)
  }
}

export async function deleteItem(req, res, next) {
  try {
    const id = req.params.id
    const item = await Item.findOneAndDelete({ _id: id, userId: req.user.id })
    res.json({ deleted: !!item })
  } catch (err) {
    next(err)
  }
}
