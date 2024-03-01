import * as React from "react";
import { Link, graphql } from "gatsby";

const IndexPage = ({
  data, // this prop will be injected by the GraphQL query below.
}) => {
  const { allMarkdownRemark } = data; // data.markdownRemark holds your post data

  return (
    <>
      <h1>Today's quizzes:</h1>
      <ul>
        {allMarkdownRemark.nodes.map((quiz) => (
          <li key={quiz.gatsbyPath}>
            <Link to={quiz.gatsbyPath}>{quiz.frontmatter.title}</Link>
          </li>
        ))}
      </ul>
    </>
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
