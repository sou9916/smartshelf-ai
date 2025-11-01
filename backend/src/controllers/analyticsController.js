import Item from '../models/Item.js'

export async function categorySummary(req, res, next) {
  try {
    const result = await Item.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ])
    res.json(result.map((r) => ({ category: r._id, count: r.count })))
  } catch (err) {
    next(err)
  }
}

export async function expiryStats(req, res, next) {
  try {
    const items = await Item.find({ userId: req.user.id })
    const expiringSoon = items.filter((i) => {
      const d = Math.ceil((new Date(i.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
      return d <= 7 && d >= 0
    }).length
    const expired = items.filter((i) => i.status === 'expired').length
    const consumed = items.filter((i) => i.status === 'consumed').length
    res.json({ expiringSoon, expired, consumed })
  } catch (err) {
    next(err)
  }
}
