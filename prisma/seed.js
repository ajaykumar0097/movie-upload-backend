import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const creatorId="2eb6b27f-c11d-4bd9-894d-00a47df8093c"

const movies = [
  {
    "title": "Inception",
    "overview": "A thief who steals corporate secrets through dream-sharing technology is given an inverse task of planting an idea.",
    "releaseYear": 2010,
    "genres": ["Sci-Fi", "Action"],
    "runtime": 148,
    "posterUrl": "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    "createdBy": creatorId
  },
  {
    "title": "Interstellar",
    "overview": "A team of explorers travel through a wormhole in space to ensure humanity's survival.",
    "releaseYear": 2014,
    "genres": ["Sci-Fi", "Drama"],
    "runtime": 169,
    "posterUrl": "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    "createdBy": creatorId
  },
  {
    "title": "The Dark Knight",
    "overview": "Batman faces the Joker, a criminal mastermind who plunges Gotham into chaos.",
    "releaseYear": 2008,
    "genres": ["Action", "Crime"],
    "runtime": 152,
    "posterUrl": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    "createdBy": creatorId
  },
  {
    "title": "Avengers: Endgame",
    "overview": "The Avengers assemble once more to reverse Thanos' actions and restore balance.",
    "releaseYear": 2019,
    "genres": ["Action", "Adventure"],
    "runtime": 181,
    "posterUrl": "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    "createdBy": creatorId
  },
  {
    "title": "Titanic",
    "overview": "A love story unfolds on the ill-fated RMS Titanic.",
    "releaseYear": 1997,
    "genres": ["Romance", "Drama"],
    "runtime": 195,
    "posterUrl": "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    "createdBy": creatorId
  },
  {
    "title": "The Matrix",
    "overview": "A hacker discovers reality is a simulation and joins a rebellion.",
    "releaseYear": 1999,
    "genres": ["Sci-Fi", "Action"],
    "runtime": 136,
    "posterUrl": "https://image.tmdb.org/t/p/w500/aoiC8pZJ7Uu8v7bJ0C1Y5EYXPLk.jpg",
    "createdBy": creatorId
  },
  {
    "title": "Gladiator",
    "overview": "A betrayed Roman general seeks revenge against the corrupt emperor.",
    "releaseYear": 2000,
    "genres": ["Action", "Drama"],
    "runtime": 155,
    "posterUrl": "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    "createdBy": creatorId
  },
  {
    "title": "Joker",
    "overview": "A mentally troubled comedian descends into madness and crime.",
    "releaseYear": 2019,
    "genres": ["Drama", "Crime"],
    "runtime": 122,
    "posterUrl": "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    "createdBy": creatorId
  },
  {
    "title": "Parasite",
    "overview": "A poor family schemes to become employed by a wealthy household.",
    "releaseYear": 2019,
    "genres": ["Thriller", "Drama"],
    "runtime": 132,
    "posterUrl": "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    "createdBy": creatorId
  },
  {
    "title": "The Shawshank Redemption",
    "overview": "Two imprisoned men bond over years, finding solace and redemption.",
    "releaseYear": 1994,
    "genres": ["Drama"],
    "runtime": 142,
    "posterUrl": "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    "createdBy": creatorId
  },
  {
    "title": "Fight Club",
    "overview": "An insomniac office worker forms an underground fight club.",
    "releaseYear": 1999,
    "genres": ["Drama"],
    "runtime": 139,
    "posterUrl": "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
    "createdBy": creatorId
  },
  {
    "title": "Forrest Gump",
    "overview": "The life journey of a simple man witnessing historical events.",
    "releaseYear": 1994,
    "genres": ["Drama", "Romance"],
    "runtime": 142,
    "posterUrl": "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    "createdBy": creatorId
  },
  {
    "title": "The Godfather",
    "overview": "The aging patriarch of a crime dynasty transfers control to his reluctant son.",
    "releaseYear": 1972,
    "genres": ["Crime", "Drama"],
    "runtime": 175,
    "posterUrl": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    "createdBy": creatorId
  },
  {
    "title": "The Lion King",
    "overview": "A young lion prince flees his kingdom only to learn responsibility.",
    "releaseYear": 1994,
    "genres": ["Animation", "Adventure"],
    "runtime": 88,
    "posterUrl": "https://image.tmdb.org/t/p/w500/2bXbqYdUdNVa8VIWXVfclP2ICtT.jpg",
    "createdBy": creatorId
  },
  {
    "title": "Spider-Man: No Way Home",
    "overview": "Spider-Man seeks help from Doctor Strange to restore his identity.",
    "releaseYear": 2021,
    "genres": ["Action", "Adventure"],
    "runtime": 148,
    "posterUrl": "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    "createdBy": creatorId
  },
  {
    "title": "Dune",
    "overview": "A noble family becomes embroiled in a war for control of a desert planet.",
    "releaseYear": 2021,
    "genres": ["Sci-Fi", "Adventure"],
    "runtime": 155,
    "posterUrl": "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    "createdBy": creatorId
  },
  {
    "title": "Oppenheimer",
    "overview": "The story of J. Robert Oppenheimer and the creation of the atomic bomb.",
    "releaseYear": 2023,
    "genres": ["Drama", "History"],
    "runtime": 180,
    "posterUrl": "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
    "createdBy": creatorId
  },
  {
    "title": "John Wick",
    "overview": "An ex-hitman comes out of retirement to track down gangsters.",
    "releaseYear": 2014,
    "genres": ["Action", "Thriller"],
    "runtime": 101,
    "posterUrl": "https://image.tmdb.org/t/p/w500/5vHssUeVe25bMrof1HyaPyWgaP.jpg",
    "createdBy": creatorId
  },
  {
    "title": "The Batman",
    "overview": "Batman uncovers corruption in Gotham while pursuing the Riddler.",
    "releaseYear": 2022,
    "genres": ["Action", "Crime"],
    "runtime": 176,
    "posterUrl": "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    "createdBy": creatorId
  },
  {
    "title": "Deadpool",
    "overview": "A wisecracking mercenary gets experimented on and gains healing powers.",
    "releaseYear": 2016,
    "genres": ["Action", "Comedy"],
    "runtime": 108,
    "posterUrl": "https://image.tmdb.org/t/p/w500/3E53WEZJqP6aM84D8CckXx4pIHw.jpg",
    "createdBy": creatorId
  }
]

const main=async()=>{
    console.log("Seeding movies...")
    for(const movie of movies){
        await prisma.movie.create({
            data:movie
        })
        console.log(`Created movie: ${movie.title}`)
    }
    console.log("Seeding completed.")
}
main().catch(err=>{
    console.error("Error seeding data:",err)
    process.exit(1)
}).finally(async()=>{
    await prisma.$disconnect()
})