import * as React from "react"
import { graphql } from "gatsby"

const IndexPage = ({
  data, // this prop will be injected by the GraphQL query below.
}) => {
  const { allMarkdownRemark } = data // data.markdownRemark holds your post data

  const quizes = allMarkdownRemark.nodes.map(({frontmatter}) => frontmatter);

  return (
    <>
      <h1>Today's quizzes:</h1>
      {quizes.map(({title, subcategories}, index) => (
        <>
          <h2 key={index}>{title}</h2>
          {subcategories && subcategories.map(({title, answers}) => (
            <>
              <p>{title}</p>
              {answers && <ul>
                {answers.map(({value}) => (
                  <li>{value}</li>
                ))}
              </ul>}
            </>              
          ))}
        </>
      ))}
    </>
  )
}

export const pageQuery = graphql`
  query {
    allMarkdownRemark {
      nodes {
        id
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
  }
`

export default IndexPage

export const Head = () => <title>Home Page</title>
