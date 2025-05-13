
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface MoodDataItem {
  day: string;
  value: number;
  mood: string;
  note: string;
}

interface MoodChartProps {
  moodData: MoodDataItem[];
}

const MoodChart = ({ moodData }: MoodChartProps) => {
  const [activeTimeframe, setActiveTimeframe] = useState('7days');

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-skyhug-100">
          <p className="text-lg mb-1">{data.mood}</p>
          <p className="text-sm text-muted-foreground">{data.note}</p>
          <p className="text-xs font-medium text-skyhug-500 mt-1">{data.day}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-panel mb-8 overflow-hidden">
      <CardHeader className="border-b border-border/10 bg-white/30">
        <div className="flex items-center justify-between">
          <CardTitle>Mood Over Time</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant={activeTimeframe === '7days' ? 'default' : 'outline'} 
              size="sm" 
              className="text-xs h-8 rounded-full"
              onClick={() => setActiveTimeframe('7days')}
            >
              Last 7 days
            </Button>
            <Button 
              variant={activeTimeframe === '30days' ? 'default' : 'outline'} 
              size="sm" 
              className="text-xs h-8 rounded-full"
              onClick={() => setActiveTimeframe('30days')}
            >
              30 days
            </Button>
            <Button 
              variant={activeTimeframe === 'all' ? 'default' : 'outline'} 
              size="sm" 
              className="text-xs h-8 rounded-full"
              onClick={() => setActiveTimeframe('all')}
            >
              All time
            </Button>
          </div>
        </div>
        <CardDescription>Your emotional journey visualized</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-2 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={moodData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 5]} 
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => {
                const labels = ['', '😔', '😐', '🙂', '😄', '🌟'];
                return labels[value] || '';
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              fillOpacity={1}
              fill="url(#moodGradient)" 
              strokeWidth={3}
              activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MoodChart;
