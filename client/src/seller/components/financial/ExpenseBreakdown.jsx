import React from "react";

const ExpenseBreakdown = ({ expenses }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getColor = (index) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-purple-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Phân tích chi phí</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(expenses.total)}
          </p>
          <p className="text-sm text-gray-600">Tổng chi phí</p>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="space-y-4">
        {expenses.breakdown.map((expense, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className={`w-3 h-3 rounded-full ${getColor(index)}`}></div>
              <span className="text-sm font-medium flex-1">
                {expense.category}
              </span>
              <span className="text-sm text-gray-500 w-16 text-right">
                {expense.percentage}%
              </span>
            </div>
            <div className="w-32">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getColor(index)}`}
                  style={{ width: `${expense.percentage}%` }}
                ></div>
              </div>
            </div>
            <div className="text-right w-24">
              <div className="font-semibold text-sm">
                {formatCurrency(expense.amount)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expense Summary */}
      <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-600">Giá vốn hàng bán</div>
          <div className="font-semibold">{formatCurrency(expenses.cogs)}</div>
        </div>
        <div>
          <div className="text-gray-600">Vận chuyển</div>
          <div className="font-semibold">
            {formatCurrency(expenses.shipping)}
          </div>
        </div>
        <div>
          <div className="text-gray-600">Marketing</div>
          <div className="font-semibold">
            {formatCurrency(expenses.marketing)}
          </div>
        </div>
        <div>
          <div className="text-gray-600">Phí sàn</div>
          <div className="font-semibold">
            {formatCurrency(expenses.platformFees)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseBreakdown;
