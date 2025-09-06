import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { parseCSV } from "@/lib/parse-csv";
import { CongressNumber } from "@/types/congress-metadata";

export type Chamber = "house" | "senate";
export type Control = "Republican" | "Democratic";

export interface YoutubeEventIdRow {
    committee_name: string;
    handle: string;
    total_videos: number;
    missing_event_id: number;
    congress_number: CongressNumber;
    control: Control;
    chamber: Chamber;
}

function parseRow(d: Record<string, string>): YoutubeEventIdRow {
    return {
        committee_name: d.committee_name,
        handle: d.handle,
        total_videos: Number(d.total_videos),
        missing_event_id: Number(d.missing_event_id),
        congress_number: d.congress_number as CongressNumber,
        control: d.control as Control,
        chamber: d.chamber as Chamber,
    };
}

export async function fetchYoutubeEventIdReport(): Promise<YoutubeEventIdRow[]> {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const res = await fetch(basePath + "/data/youtube/youtube_event_id_report.csv");
    if (!res.ok) {
        throw new Error(`Failed to fetch CSV: ${res.status} ${res.statusText}`);
    }
    const text = await res.text();
    const rows = parseCSV(text);
    return rows.map(parseRow);
}

export function useYoutubeEventIdReport(): UseQueryResult<YoutubeEventIdRow[], Error> {
    return useQuery<YoutubeEventIdRow[], Error>({
        queryKey: ["youtubeEventIdReport"],
        queryFn: fetchYoutubeEventIdReport,
        staleTime: 5 * 60 * 1000,
    });
}

export default useYoutubeEventIdReport;
