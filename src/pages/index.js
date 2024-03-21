import * as React from "react";
import { Link, graphql } from "gatsby";

import Layout from "../components/layout";
import logo from "../images/logo-quizzes-font-honk.png";
import favicon from "../images/favicon.png";

const IndexPage = ({
  data, // this prop will be injected by the GraphQL query below.
}) => {
  const { allMarkdownRemark } = data;

  return (
    <Layout>
      <img src={logo} alt="Logo" className="lg:mt-8" />
      <ul
        className="flex flex-wrap w-full gap-x-[--gapx] gap-y-8 overflow-y-auto items-center break-words py-[7%] md:py-0
        [--mask:linear-gradient(0deg,#0000,#000_4%_96%,#0000)] md:[--mask:none] [-webkit-mask:--mask] [mask:--mask] mt-4 md:mt-16 grow content-normal md:mb-8"
        style={{
          "--gapx": "4rem",
        }}
      >
        {allMarkdownRemark.nodes
          // test more items
          // .reduce((p, c) => {
          //   p.push(c, c, c);
          //   return p;
          // }, [])
          // test fewer items
          // .slice(0, 3)
          .map((quiz) => (
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

export const Head = () => (
  <>
    <title id="title">Quizzes</title>
    <meta content="Your new favorite quiz app!" name="description" />
    <link rel="icon" href={favicon} />
  </>
);
