import * as React from "react"
import { graphql } from "gatsby"

const IndexPage = ({
  data, // this prop will be injected by the GraphQL query below.
}) => {
  const { allMarkdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = allMarkdownRemark

  const quizes = allMarkdownRemark.edges[0].node.frontmatter.quiz;
  console.log(quizes)

  return (
    <div>
      <div>
        <h1>Today's quizzes:</h1>
        {quizes.map(({title, subcategory}, index) => (
          <>
            <h2 key={index}>{title}</h2>
            {console.log("sub", subcategory)}
            {subcategory.map(({title, answer}) => (
              <>
                <p>{title}</p>
                {answer && <ul>
                  {answer.map(({value}) => (
                    <li>{value}</li>
                  ))}
                </ul>}
              </>              
            ))}
          </>
        ))}        
      </div>
    </div>
  )
}

// TODO: MAKE THE RESPONSE SIMPLER BY SIMPLIFYING QUERY LIKE BELOW


// export const pageQuery = graphql`
//   query($id: String!) {
//     markdownRemark(id: { eq: $id }) {
//       html
//       frontmatter {
//         date(formatString: "MMMM DD, YYYY")
//         slug
//         title
//       }
//     }
//   }
// `

export const pageQuery = graphql`
  query {
    allMarkdownRemark {
      edges {
        node {
          id
          frontmatter {
            quiz {
              title
              subcategory {
                title
                answer {
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`

export default IndexPage

export const Head = () => <title>Home Page</title>
