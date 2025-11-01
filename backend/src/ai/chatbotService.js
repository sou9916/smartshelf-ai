import Item from '../models/Item.js'
import OpenAI from 'openai'

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null

export async function chatWithAssistant(userId, messages = []) {
  const last = messages[messages.length - 1]?.content?.toLowerCase() || ''

  // Simple intent: items expiring soon/next week
  if (last.includes('expiring') || last.includes('next week')) {
    const now = new Date()
    const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const items = await Item.find({
      userId,
      expiryDate: { $gte: now, $lte: weekAhead },
      status: 'active'
    }).sort({ expiryDate: 1 })

    if (!items.length) return 'No items expiring in the next 7 days. Nice work!'

    const lines = items.map((i) => `${i.name} (${i.category}) – ${new Date(i.expiryDate).toLocaleDateString()}`)
    return `Here are items expiring within a week:\n- ${lines.join('\n- ')}\nTip: prioritize perishables first.`
  }

  // Fallback to OpenAI if available
  if (client) {
    try {
      const prompt = `You are Smart Shelf AI. Answer user questions about expiry, food safety, and savings in a helpful, concise way.\nUser: ${last}`
      const completion = await client.responses.create({
        model: 'gpt-4.1-mini',
        input: prompt
      })
      return completion.output_text || 'I’m here to help with your inventory and expiry questions.'
    } catch {
      return 'I’m here to help with your inventory and expiry questions.'
    }
  }

  return 'Ask me about items, expiry tips, or how to reduce waste.'
}
