import { server } from "@/_data"

export async function uploadImage(file: FormData, dev?: number) {
  if (process.env.NODE_ENV !== "production") {
    dev = dev ?? 0
    return {
      msg: "ok",
      imageSrc: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2Ayjtz4IYEbImEI_Hma-mIZlnocfo2HCOtw&usqp=CAU",
        "https://www.sisajournal.com/news/photo/202210/247637_160771_209.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWl8n9PjJQn8N3OJF9s-59pbNKQ5oV5EWKoA&usqp=CAU",
        "https://i.namu.wiki/i/TV8roGjCbWAxxcT_EaighED21VQt6GyGtb7VWI-w3MATESBccMKacmjWddFinp7-f6C_8UX3i1MyqOKDOnvoWw.webp",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVWQ2x9RdgxuldX8cszw6s2nt4pzZ_Dx3yfw&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKyyTSFhDGAmRZdUgwUgivWoLlhu6P3zsLOA&usqp=CAU",
        "https://www.kkday.com/ko/blog/wp-content/uploads/thailand_chiangmai.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkBzNumr5AiXxe6DWGaJ9ArgWo8faK4RmjhQ&usqp=CAU",
        "https://i.pinimg.com/564x/e8/a4/92/e8a492aad5e489634ff3970fe27f3051.jpg",
        "https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/231/1fe95a2b0144dc98c6e97cd4bb90e1e6_res.jpeg",
      ][Math.floor(Math.random() * 10)],
    }
  } else {
    const response = await server.post(`/upload`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  }
}

export async function createNewPost(newPost: { [key: string]: any }) {
  try {
    console.log(newPost)

    const response = await server.post(`/post`, newPost)
    return { msg: "ok", data: response.data }
  } catch (error) {
    return error
  }
}
