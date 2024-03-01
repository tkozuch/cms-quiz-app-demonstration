import * as React from "react";
import { graphql } from "gatsby";

const QuizPage = ({
  data, // this prop will be injected by the GraphQL query below.
}) => {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const quiz_data = markdownRemark.frontmatter;

  return (
    <>
      <h2 className="text-3xl">{quiz_data.title}</h2>
      <div className="flex flex-row">
        {quiz_data.subcategories.map(({ title, answers }, i) => (
          <div className="flex flex-col" key={i}>
            <h3 className="text-xl">{title}</h3>
            <ul>
              {answers.map((answer, i) => (
                <li key={i}>{answer.value}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export const pageQuery = graphql`
  query ($id: String) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        subcategories {
          title
          answers {
            value
          }
        }
      }
    }
  }
`;

export default QuizPage;
