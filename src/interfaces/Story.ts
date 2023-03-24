import { BaseBlock } from "./BaseBlock";

export interface Story {
    "name": string;
    "created_at": string;
    "published_at": string;
    "id": number;
    "uuid": string;
    "content": BaseBlock;
    "slug": string;
    "full_slug": string;
    [attributes: string]: unknown;
}