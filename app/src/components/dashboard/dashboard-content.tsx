"use client";

import { CongressNumber } from "@/types/congress-metadata";

import useYoutubeEventIdReport from "@/hooks/use-youtube-event-id-report";

import { StackedBarChart } from "./stacked-bar-chart";
import { useSearchParams } from "next/navigation";
import { TitleHeader } from "./title-header";
import { ChartPieDonutText } from "./donut-text";
import { TreeMap } from "./tree-map";
import { Leaderboard } from "./leaderboard";
import { useState } from "react";

export function DashboardContent({}) {
    const { data, error, isError, isLoading } = useYoutubeEventIdReport();
    const searchParams = useSearchParams();

    const defaultCongressNumber: CongressNumber =
        (searchParams.get("congress") as CongressNumber) ?? "119";

    const [congressNumber, setCongressNumber] = useState(defaultCongressNumber);
    if (isLoading) return null;
    if (isError) throw error;
    if (!data) return null;

    const congressData = data.filter((eventIdRow) => eventIdRow.congress_number === congressNumber);
    return (
        <div className="grid w-screen grid-cols-2 gap-4 p-4 md:grid-cols-4">
            <TitleHeader
                {...{ congressNumber, setCongressNumber }}
                className="col-span-2 md:col-span-1"
            />
            <Leaderboard {...{ congressData }} className="col-span-2" />
            <ChartPieDonutText {...{ congressData }} />
            <StackedBarChart {...{ congressData }} className="col-span-2" />
            <TreeMap {...{ congressData }} className="col-span-2" />
        </div>
    );
}
