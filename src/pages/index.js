import * as React from "react";
import { Link, graphql } from "gatsby";

import Layout from "../components/layout";

const IndexPage = ({
  data, // this prop will be injected by the GraphQL query below.
}) => {
  const { allMarkdownRemark } = data; // data.markdownRemark holds your post data

  return (
    <Layout>
      <h1 className="text-6xl sm:text-7xl mb-24 text-center ">
        Today's quizzes:
      </h1>
      <ul
        className="flex flex-wrap w-full gap-x-[--gapx] gap-y-8 max-h-[70vh] overflow-y-auto items-center break-words "
        style={{ "--gapx": "4rem" }}
      >
        {allMarkdownRemark.nodes.map((quiz) => (
          <li
            key={quiz.gatsbyPath}
            className="flex flex-col flex-wrap w-full md:w-[--md-width] lg:w-[--lg-width] text-center"
            style={{
              "--lg-width": "calc(25% - var(--gapx))",
              "--md-width": "calc(33.3333% - var(--gapx))",
            }}
          >
            <Link
              to={quiz.gatsbyPath}
              className="text-xl max-w-full text-green-900 underline underline-offset-2 hover:text-green-700 transition-[color]"
            >
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
