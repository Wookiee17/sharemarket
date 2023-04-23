import axios from "axios"
export default async function handler(req, res) {
	if (req.method === 'GET') {
		try{
			const resp = await axios.get("https://api.razorpay.com/v1/plans", {
				auth: {
					username: process.env.NEXT_RAZORPAY_KEY_ID,
					password: process.env.NEXT_RAZORPAY_KEY_SECRET
				}
			})
			res.status(200).json(resp.data)
		}catch(err){
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