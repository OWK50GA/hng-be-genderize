import { Router, Request, Response } from "express";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
    res.json({
        status: "Healthy",
        timestamp: new Date().toISOString()
    })
});

type GenderizeAPIResponse = {
    count: number,
    name: string,
    gender: string,
    probability: number
}

router.get("/classify", async (req: Request, res: Response) => {
    const { name: queryName } = req.query;
    console.log("name: ", queryName);
    if (!queryName || queryName === "") {
        return res.status(400).json({
            status: "error",
            message: "No name provided in query"
        });
    }

    if (typeof queryName !== 'string') {
        return res.status(422).json({
            status: "error",
            message: "Unprocessable entity"
        });
    }

    try {
        const genderizeRes = await fetch(`https://api.genderize.io?name=${queryName}`)

        if (!genderizeRes.ok) {
            return res.status(502).json({
                status: "error",
                message: "External API error"
            })
        }

        const { count: sampleSize, name, probability, gender }: GenderizeAPIResponse = await genderizeRes.json();

        if (gender === "null" || sampleSize === 0) {
            return res.status(400).json({
                status: "error",
                message: "No prediction available for the provided name"
            })
        }
        const is_confident = probability >= 0.7 && sampleSize >= 100;

        return res.status(200).json({
            status: "success",
            data: {
                name,
                gender,
                probability,
                sample_size: sampleSize,
                is_confident,
                processed_at: new Date().toISOString()
            },  
        })
    
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        })
    }
})

export default router;