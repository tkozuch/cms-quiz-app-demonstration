import * as React from "react";
import { Link, graphql } from "gatsby";

import Layout from "../components/layout";
// /**
//  * @param {array} array
//  */
// const divideIntoEqualColumns = (array) => {
//   if (array.length <= 1) {
//     return [array, []];
//   }

//   const divisionIndex = Math.ceil(array.length / 2); // 4/2 = 2, ceil(2) = 2; 3/2 = 1.5, ceil(1.5) = 2

//   return [array.slice(0, divisionIndex + 1), array.slice(divisionIndex + 1)];
// };

const IndexPage = ({
  data, // this prop will be injected by the GraphQL query below.
}) => {
  const { allMarkdownRemark } = data; // data.markdownRemark holds your post data

  // data for UI testing purposes
  // const dummyData = [];
  // dummyData.push(
  //   [
  //     "dummy",
  //     "dummy",
  //     "dummy",
  //     "dummy",
  //     "dummy",
  //     "dummy",
  //     "dummy",
  //     "dummy",
  //     "Taylor Swift Songs",
  //     "dummy",
  //     "dummy",
  //     "dummy",
  //     "dummy",
  //     "dummy",
  //     "dummy",
  //     "dummy",
  //   ].map((x) => ({ frontmatter: { title: x } }))
  // );
  // const testData = allMarkdownRemark.nodes.concat(...dummyData);
  // ----------------------------

  return (
    <Layout>
      <h1 className="text-6xl sm:text-7xl mb-24 text-center ">
        Today's quizzes:
      </h1>
      <ul
        className="flex flex-wrap w-full gap-x-[--gapx] gap-y-8 max-h-[70vh] overflow-y-auto items-center break-words"
        style={{ "--gapx": "4rem" }}
      >
        {allMarkdownRemark.nodes.map((quiz) => (
          <li
            key={quiz.gatsbyPath}
            className="flex flex-col flex-wrap w-full md:w-[--md-width] text-center "
            style={{ "--md-width": "calc(25% - var(--gapx))" }}
          >
            <Link to={quiz.gatsbyPath} className="text-xl max-w-full">
              {quiz.frontmatter.title}
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export const pageQuery = graphql`
  query {
    allMarkdownRemark {
      nodes {
        frontmatter {
          title
        }
        gatsbyPath(filePath: "/quiz/{MarkdownRemark.parent__(File)__name}")
      }
    }
  }
`;

export default IndexPage;

export const Head = () => <title>Home Page</title>;
