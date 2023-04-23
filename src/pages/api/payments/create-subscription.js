import axios from "axios"
export default async function handler(req, res) {
	if (req.method === 'POST') {
		const planId = req.body.plan_id
		try {
			if (!planId) {
				res.status(400).json({ message: "Please provide plan id with request body" })
				return
			}
			const name = "John Doe"
			const resp = await axios.post("https://api.razorpay.com/v1/subscriptions", {
				"plan_id": planId,
				"total_count": 12,
				"quantity": 1,
				"customer_notify": 1,
				"notes": {
					name
				}
			}, {
				auth: {
					username: process.env.NEXT_RAZORPAY_KEY_ID,
					password: process.env.NEXT_RAZORPAY_KEY_SECRET
				}
			})
			res.status(200).json(resp.data)
		} catch (err) {
			if (err?.response?.data) {
				res.status(400).json(err.response.data)
			} else {
				res.status(400).json(err)
			}
		}
	} else {
		res.status(404).json({ message: '404: No route found!' })
	}
}