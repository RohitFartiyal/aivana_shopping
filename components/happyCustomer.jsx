"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CustomerReviews() {
  const reviews = [
    {
      name: "Alice Johnson",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      content:
        "Amazing service! Fast delivery and excellent customer support. Highly recommended!",
    },
    {
      name: "Michael Lee",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      content:
        "I loved the quality and ease of purchase. Will definitely shop again!",
    },
    {
      name: "Sophia Martinez",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      content:
        "Fantastic experience from start to finish. Truly happy with my order.",
    },
    {
      name: "Alice Johnson",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      content:
        "Amazing service! Fast delivery and excellent customer support. Highly recommended!",
    }
  ];

  return (
    <div className="w-full mx-auto px-10 py-12">
      <h2 className="text-4xl font-extrabold text-gray-900 uppercase text-center mb-8">Our Happy Customers</h2>
      <div className="grid gap-6 md:grid-cols-4">
        {reviews.map((review, index) => (
          <Card key={index} className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={review.image} alt={review.name} />
                <AvatarFallback>{review.name[0]}</AvatarFallback>
              </Avatar>
              <p className="text-gray-700 text-sm">{review.content}</p>
              <p className="font-semibold text-gray-900">{review.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
