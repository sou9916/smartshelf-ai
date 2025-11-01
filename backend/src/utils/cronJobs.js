import cron from 'node-cron'
import Item from '../models/Item.js'
import Notification from '../models/Notification.js'
import { sendEmail } from './mailer.js'
import { sendPushToAll } from './push.js'

export function initCronJobs() {
  // Runs every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    try {
      const now = new Date()
      const soonItems = await Item.find({ status: 'active' })
      for (const i of soonItems) {
        const diffDays = Math.ceil((new Date(i.expiryDate) - now) / (1000 * 60 * 60 * 24))
        if (diffDays <= 3 && diffDays >= 0) {
          const title = 'Daily reminder: expiring soon'
          const message = `${i.name} expires in ${diffDays} day(s).`
          await Notification.create({ userId: i.userId, itemId: i._id, title, message, type: 'email' })
          // You might need to fetch the user's email via populate; omitted for brevity
          sendPushToAll(title, message).catch(() => {})
        } else if (diffDays < 0 && i.status !== 'expired') {
          i.status = 'expired'
          await i.save()
        }
      }
      console.log('Cron job executed: expiry checks')
    } catch (err) {
      console.error('Cron error:', err.message)
    }
  })
}
