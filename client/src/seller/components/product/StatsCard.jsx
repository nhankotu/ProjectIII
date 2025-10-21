// src/seller/components/product/StatsCard.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const StatsCard = ({
  title,
  value,
  icon,
  change,
  changeType = "neutral",
  subtitle,
}) => {
  const getColors = () => {
    switch (changeType) {
      case "positive":
        return {
          border: "border-l-green-500",
          iconBg: "bg-green-50 text-green-600",
          changeBg: "bg-green-100 text-green-800 hover:bg-green-100",
          valueColor: "text-green-600",
        };
      case "negative":
        return {
          border: "border-l-amber-500",
          iconBg: "bg-amber-50 text-amber-600",
          changeBg: "bg-amber-100 text-amber-800 hover:bg-amber-100",
          valueColor: "text-amber-600",
        };
      default:
        return {
          border: "border-l-blue-500",
          iconBg: "bg-blue-50 text-blue-600",
          changeBg: "bg-blue-100 text-blue-800 hover:bg-blue-100",
          valueColor: "text-blue-600",
        };
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return "↗️";
      case "negative":
        return "↘️";
      default:
        return "➡️";
    }
  };

  const colors = getColors();

  return (
    <Card
      className={`border-l-4 ${colors.border} hover:shadow-lg transition-shadow duration-200`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtitle && (
                <span className="text-sm text-gray-500">{subtitle}</span>
              )}
            </div>

            {change && (
              <div className="flex items-center gap-1">
                <Badge
                  variant="secondary"
                  className={`text-xs ${colors.changeBg}`}
                >
                  <span className="mr-1">{getChangeIcon()}</span>
                  {change}
                </Badge>
              </div>
            )}
          </div>

          <div className={`p-3 rounded-lg ${colors.iconBg}`}>
            <span className="text-xl">{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
