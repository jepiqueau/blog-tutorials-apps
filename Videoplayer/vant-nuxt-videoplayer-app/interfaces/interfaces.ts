export interface SubtitleOptions {
    backgroundColor?: string,
    fontSize?: number,
    foregroundColor?: string
}
export interface VideoModel {
    device: string,
    title?: string,
    description?: string,
    url: string,
    type: string,
    gif?: string,
    published_at: string,
    subtitle_url?: string,
    subtitle_langage?: string,
    subtitle_options?: SubtitleOptions
}
