"use client"

import { addReview } from "@/actions/review"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import useFetch from "@/hooks/use-fetch"
import { useAuth } from "@clerk/nextjs"
import { Loader2, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const PostReview = ({ id, onSuccess, rv }) => {

    const { isSignedIn } = useAuth()


    const [open, setOpen] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [hover, setHover] = useState(null);
    const [rating, setRating] = useState(0);

    const { loading, fn: postReview, data: reviewResult } = useFetch(addReview);

    useEffect(() => {
        if (reviewResult?.success) {
            toast.success("Review posted!");
            setOpen(false);
            setReviewText("");
            setRating(0);
            setHover(null);
            if (onSuccess) {
                onSuccess();
                console.log("wow", rv)
            }
        }
    }, [reviewResult]);


    const handleSubmit = async (e) => {
        if (isSignedIn == false) {
            toast.warning("Please Login to post Review")
            return
        }
        e.preventDefault();
        if (reviewText !== "" && rating !== 0) {
            const data = {
                ratting: rating,
                review: reviewText,
                productId: id,
            };
            await postReview(data, id);
        } else {
            toast.error("Please fill all fields");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>


            <DialogTrigger asChild>
                <Badge
                    className="py-2 px-4 rounded-2xl cursor-pointer"
                    onClick={() => {
                        if (!isSignedIn) {
                            toast.warning("Please login to post a review");
                        } else {
                            setOpen(true);
                        }
                    }}
                >
                    Post Review
                </Badge>
            </DialogTrigger>

            <DialogContent className="z-[9999]">
                <DialogHeader>
                    <DialogTitle>Share your feedback on this product</DialogTitle>
                </DialogHeader>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

                    {/* Rating */}
                    <div className="border px-5 py-2 rounded-md">
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                    key={i}
                                    size={30}
                                    className={`cursor-pointer transition-colors ${i < (hover ?? rating) ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-400"}`}
                                    onMouseEnter={() => setHover(i + 1)}
                                    onMouseLeave={() => setHover(null)}
                                    onClick={() => setRating(i + 1)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Review text */}
                    <div className="border px-5 py-4 rounded-md">
                        <h3 className="text-sm text-gray-500 mb-5">Tell us what you liked or disliked about this product</h3>
                        <Input
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Write your review..."
                        />
                    </div>

                    {/* Submit */}
                    <Button className="mx-4" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Posting Review...
                            </>
                        ) : (
                            "Post Review"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default PostReview
