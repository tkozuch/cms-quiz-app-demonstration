import * as React from "react";
import { Link, graphql } from "gatsby";

import Layout from "../components/layout";
import logo from "../images/logo-quizzes-font-honk.png";

const IndexPage = ({
  data, // this prop will be injected by the GraphQL query below.
}) => {
  const { allMarkdownRemark } = data; // data.markdownRemark holds your post data

  return (
    <Layout>
      <img src={logo} alt="Logo" />
      <ul
        className="flex flex-wrap w-full gap-x-[--gapx] gap-y-8 max-h-[70vh] overflow-y-auto items-center break-words py-[10%] sm:py-0
        [--mask:linear-gradient(0deg,#0000,#000_10%_90%,#0000)] sm:[--mask:none] [-webkit-mask:--mask] [mask:--mask] "
        style={{
          "--gapx": "4rem",
        }}
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
