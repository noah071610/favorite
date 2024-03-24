import { getThumbnail } from "@/_data/post"
import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)

    const postId = url.searchParams.get("postId")

    const { thumbnail, title } = await fetch(`http://localhost:5555/post?postId=${postId}`, {
      method: "GET", // *GET, POST, PUT, DELETE 등
      mode: "no-cors", // no-cors, *cors, same-origin
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((data) => data)
    const arr = getThumbnail(thumbnail)

    return new ImageResponse(
      (
        <div style={{ display: "flex" }}>
          {arr.map((src, i) => (
            <div
              key={i}
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: "1200px 630px",
                backgroundPosition: "left 600px",
                backgroundAttachment: "fixed",
                height: "630px",
                width: `${100 / arr.length}%`,
              }}
            />
          ))}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    return new Response("Failed to generate OG image", { status: 500 })
  }
}
