"use client"

import { scholarshipPortals } from "@/lib/scholarship-data"
import { individualScholarships } from "@/lib/individual-scholarships"
import { Award, Users, Building2, TrendingUp } from "lucide-react"

export function ScholarshipStats() {
  const totalPortals = scholarshipPortals.length
  const totalSchemes = individualScholarships.length
  const centralCount = individualScholarships.filter(s => s.type === "Central").length
  const stateCount = individualScholarships.filter(s => s.type === "State").length
  const privateCount = individualScholarships.filter(s => s.type === "Private").length

  const stats = [
    {
      icon: <Award className="w-5 h-5" />,
      label: "Total Schemes",
      value: totalSchemes,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      label: "Official Portals",
      value: totalPortals,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "States Covered",
      value: "28+",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ]

  const categories = [
    { type: "Central", count: centralCount, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    { type: "State", count: stateCount, color: "bg-green-500/10 text-green-600 dark:text-green-400" },
    { type: "Private", count: privateCount, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  ]

  return (
    <div className="space-y-6 lg:space-y-8 h-full flex flex-col">
      {/* Statistics Cards */}
      <div className="bg-gradient-to-br from-card via-card/95 to-card/90 border-2 border-primary/20 rounded-2xl p-6 lg:p-7 xl:p-8 shadow-xl backdrop-blur-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-300 flex-shrink-0">
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-7">
            <div className="p-2.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl shadow-sm">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Quick Stats</h3>
          </div>
          
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-background/60 backdrop-blur-sm border border-border/60 hover:bg-background hover:border-primary/40 hover:shadow-md transition-all duration-300 group/item"
              >
                <div className={`p-3.5 rounded-xl ${stat.bgColor} ${stat.color} shadow-sm group-hover/item:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-bold text-foreground mb-0.5">{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Breakdown */}
      <div className="bg-gradient-to-br from-card via-card/95 to-card/90 border-2 border-primary/20 rounded-2xl p-5 lg:p-6 shadow-xl backdrop-blur-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-300 flex-shrink-0">
        {/* Decorative gradient */}
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors" />
        
        <div className="relative z-10">
          <h3 className="text-base lg:text-lg font-bold text-foreground mb-4">By Category</h3>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2.5 lg:p-3 rounded-lg bg-background/60 backdrop-blur-sm border border-border/60 hover:bg-background hover:border-primary/40 hover:shadow-md transition-all duration-300 group/item"
              >
                <span className="font-semibold text-sm text-foreground">{category.type}</span>
                <span className={`px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-md font-bold text-xs border ${category.color} shadow-sm group-hover/item:scale-105 transition-transform`}>
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

