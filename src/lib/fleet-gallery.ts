export interface FleetGalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

export const FLEET_GALLERY_IMAGES: FleetGalleryImage[] = [
  {
    id: "fleet-01",
    src: "/namutek-hero-truck.jpg",
    alt: "Namutek heavy-haulage truck",
    caption: "Prime mover ready for long-distance freight transport.",
  },
  {
    id: "fleet-02",
    src: "/namutek-prime-mover.png",
    alt: "Namutek prime mover",
    caption: "Prime mover for heavy-duty haulage assignments.",
  },
  {
    id: "fleet-03",
    src: "/namutek-flatbed-truck.png",
    alt: "Namutek flatbed truck",
    caption: "Flatbed truck for construction material transport.",
  },
  {
    id: "fleet-04",
    src: "/namutek-tipper-truck.png",
    alt: "Namutek tipper truck",
    caption: "Tipper truck for aggregate and site delivery work.",
  },
  {
    id: "fleet-05",
    src: "/namutek-heavy-trailer.png",
    alt: "Namutek heavy trailer",
    caption: "Heavy trailer for oversized cargo transport.",
  },
  {
    id: "fleet-06",
    src: "/namutek-fleet-yard.jpg",
    alt: "Namutek fleet yard",
    caption: "Fleet yard with vehicles ready for dispatch.",
  },
  {
    id: "fleet-07",
    src: "/photo .14.png",
    alt: "Namutek fleet vehicle",
    caption: "Fleet vehicle in service.",
  },
  {
    id: "fleet-08",
    src: "/photo 2.jpg",
    alt: "Namutek transport operation",
    caption: "Transport operation in progress.",
  },
  {
    id: "fleet-09",
    src: "/photo 4.jpg",
    alt: "Namutek fleet equipment",
    caption: "Fleet equipment on assignment.",
  },
  {
    id: "fleet-10",
    src: "/photo 5.jpg",
    alt: "Namutek logistics operation",
    caption: "Logistics operation supporting client delivery.",
  },
  {
    id: "fleet-11",
    src: "/WhatsApp Image 2026-10-18 at 11.58.27 AM.jpeg",
    alt: "Namutek fleet vehicle",
    caption: "Fleet vehicle photographed during operations.",
  },
  {
    id: "fleet-12",
    src: "/WhatsApp Image 2026-10-18 at 11.58.27 AM (1).jpeg",
    alt: "Namutek transport vehicle",
    caption: "Transport vehicle in service.",
  },
  {
    id: "fleet-13",
    src: "/WhatsApp Image 2026-10-18 at 11.58.27 AM (2).jpeg",
    alt: "Namutek fleet asset",
    caption: "Fleet asset ready for assignment.",
  },
  {
    id: "fleet-14",
    src: "/WhatsApp Image 2026-10-18 at 11.58.27 AM (3).jpeg",
    alt: "Namutek transport operation",
    caption: "Transport operation captured during delivery.",
  },
  {
    id: "fleet-15",
    src: "/WhatsApp Image 2026-10-18 at 11.59.07 AM.jpeg",
    alt: "Namutek fleet vehicle",
    caption: "Fleet vehicle on the road.",
  },
  {
    id: "fleet-16",
    src: "/736b11a4-2b50-4d6a-bc6f-8c12184a42ae.jpg",
    alt: "Namutek fleet vehicle",
    caption: "Fleet vehicle supporting client operations.",
  },
  {
    id: "fleet-17",
    src: "/34ed4d_50ee517a9c094e86b4d6ea84869f9ec5~mv2.avif",
    alt: "Namutek fleet vehicle",
    caption: "Fleet vehicle in service.",
  },
] as const;

export const FLEET_GALLERY_BATCH_SIZE = 24;