import Notification from '../models/Notification.js'
import { sendEmail } from '../utils/mailer.js'
import { sendPushToAll } from '../utils/push.js'

export async function getAll(req, res, next) {
  try {
    const list = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(list)
  } catch (err) {
    next(err)
  }
}

export async function markRead(req, res, next) {
  try {
    const { id } = req.body
    const updated = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { read: true },
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

/* Example manual trigger (optional) */
export async function sendTest(req, res, next) {
  try {
    await sendEmail(req.user.email, 'Test Notification', 'This is a test email.')
    await sendPushToAll('Test Push', 'This is a test push message.')
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}
