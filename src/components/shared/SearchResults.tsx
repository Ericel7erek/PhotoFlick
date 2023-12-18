// import { Models } from "appwrite"
// import GridPostList from "./GridPostList"
// import Loader from "./Loader"

// type SearchResultsProps = {
//     isSearchFetching: boolean,
//     searchedPosts: Models.Document[]
// }

// const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultsProps) => {
//     if (isSearchFetching) return <Loader />


//     if (searchedPosts.length === 0) {
//         return (
//             <p className="text-light-4 mt-10 text-center w-full">No results found</p>
//         )
//     }
//     if (searchedPosts && searchedPosts.documents.length > 0) {
//         return (
//             <div className="flex-center w-full h-full">
//                 <GridPostList posts={searchedPosts.documents} showUser={false} showStats={false} />
//             </div>
//         )
//     }
// }

// export default SearchResults;