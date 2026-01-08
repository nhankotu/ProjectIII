import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";

const ProductReviews = ({ productId }) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
    pros: "",
    cons: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Mock reviews data
  useEffect(() => {
    const mockReviews = [
      {
        id: 1,
        user: {
          name: "John Doe",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        },
        rating: 5,
        title: "Excellent product!",
        comment:
          "Very satisfied with this purchase. The quality exceeded my expectations.",
        pros: "Great quality, fast shipping",
        cons: "Slightly expensive",
        date: "2024-01-15",
        helpful: 24,
        verified: true,
      },
      {
        id: 2,
        user: {
          name: "Jane Smith",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
        },
        rating: 4,
        title: "Good value for money",
        comment: "Works as described. Good customer service.",
        pros: "Affordable, reliable",
        cons: "Packaging could be better",
        date: "2024-01-10",
        helpful: 12,
        verified: true,
      },
      {
        id: 3,
        user: {
          name: "Bob Johnson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        },
        rating: 3,
        title: "Average product",
        comment: "It works, but there are better options available.",
        pros: "Functional",
        cons: "Not durable",
        date: "2024-01-05",
        helpful: 5,
        verified: false,
      },
    ];

    setReviews(mockReviews);
    setLoading(false);
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please login to submit a review");
      return;
    }

    setSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const review = {
        id: reviews.length + 1,
        user: {
          name: user.name,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
        },
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        pros: newReview.pros,
        cons: newReview.cons,
        date: new Date().toISOString().split("T")[0],
        helpful: 0,
        verified: true,
      };

      setReviews([review, ...reviews]);
      setNewReview({
        rating: 5,
        title: "",
        comment: "",
        pros: "",
        cons: "",
      });
      setShowReviewForm(false);

      alert("Thank you for your review!");
    } catch (error) {
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpfulClick = (reviewId) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    );
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage:
      (reviews.filter((r) => r.rating === rating).length / reviews.length) *
      100,
  }));

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Reviews Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              <span className="text-3xl font-bold mr-3">
                {calculateAverageRating()}
              </span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(calculateAverageRating())
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
            <span className="ml-4 text-gray-600">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {showReviewForm ? "Cancel Review" : "Write a Review"}
        </button>
      </div>

      {/* Rating Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold mb-4">Rating Breakdown</h4>
          <div className="space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.rating} className="flex items-center">
                <div className="w-12 text-sm text-gray-600">
                  {item.rating} ★
                </div>
                <div className="flex-grow mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-sm text-gray-600 text-right">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Summary */}
        <div>
          <h4 className="font-semibold mb-4">What Customers Say</h4>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h5 className="font-medium">Most Positive</h5>
                <p className="text-sm text-gray-600">
                  "Great quality and value for money"
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <h5 className="font-medium">Most Critical</h5>
                <p className="text-sm text-gray-600">
                  "Packaging could be improved"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold mb-6">Write Your Review</h4>
          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Rating *
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() =>
                      setNewReview((prev) => ({ ...prev, rating }))
                    }
                    className={`text-2xl ${
                      rating <= newReview.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title *
              </label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Summarize your experience"
                required
              />
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, comment: e.target.value }))
                }
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share details of your experience with this product"
                required
              />
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pros (Optional)
                </label>
                <textarea
                  value={newReview.pros}
                  onChange={(e) =>
                    setNewReview((prev) => ({ ...prev, pros: e.target.value }))
                  }
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What did you like about this product?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cons (Optional)
                </label>
                <textarea
                  value={newReview.cons}
                  onChange={(e) =>
                    setNewReview((prev) => ({ ...prev, cons: e.target.value }))
                  }
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What could be improved?"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="mr-4 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-8 py-3 rounded-lg font-medium ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-200 pb-6 last:border-0"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden mr-3">
                  <img
                    src={review.user.avatar}
                    alt={review.user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{review.user.name}</div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "fill-current" : "fill-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <span>• {review.date}</span>
                    {review.verified && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleHelpfulClick(review.id)}
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                <span>Helpful ({review.helpful})</span>
              </button>
            </div>

            <h4 className="font-bold text-lg mb-2">{review.title}</h4>
            <p className="text-gray-700 mb-4">{review.comment}</p>

            {/* Pros & Cons */}
            {(review.pros || review.cons) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {review.pros && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center text-green-700 mb-1">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="font-medium">Pros</span>
                    </div>
                    <p className="text-sm text-green-800">{review.pros}</p>
                  </div>
                )}
                {review.cons && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center text-red-700 mb-1">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="font-medium">Cons</span>
                    </div>
                    <p className="text-sm text-red-800">{review.cons}</p>
                  </div>
                )}
              </div>
            )}

            {/* Reply Button */}
            <button className="text-blue-600 hover:text-blue-700 text-sm">
              Reply to this review
            </button>
          </div>
        ))}

        {/* No Reviews */}
        {reviews.length === 0 && !showReviewForm && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-500 mb-6">
              Be the first to share your thoughts!
            </p>
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Write a Review
            </button>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {reviews.length > 3 && (
        <div className="text-center">
          <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium">
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
