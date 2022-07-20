import fs from 'fs'
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { join } from 'path'
import { ParsedUrlQuery } from 'querystring'
import { useEffect } from 'react';
import { getParsedFileContentBySlug, renderMarkDown } from '../../lib/markdown'
import { MarkdownRenderingResult } from '../../lib/types';


interface ArticleProps extends ParsedUrlQuery {
    slug: string
}


export function Article({ frontMatter, html }: {frontMatter: any, html: any}) {
    const router = useRouter()

    useEffect(() => {
        if (!localStorage.getItem('user-token')){
            router.push('/login')
        }
    }, [])


    return (
      <div className="container">
        <article>
          <h1 className="md-title">
            {frontMatter.title}
          </h1>
          <div>by {frontMatter.author.name}</div>
          <hr />
  
          <main dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </div>
    );
  }

const POSTS_PATH = join(process.cwd(), '_articles')
console.log(POSTS_PATH)

//@ts-ignore
export const getStaticProps: GetStaticProps<MarkdownRenderingResult> = async ({
    params,
  }: {
    params: ArticleProps;
  }) => {
    // read markdown file into content and frontmatter
    const articleMarkdownContent = getParsedFileContentBySlug(
      params.slug,
      POSTS_PATH
    );
  
    // generate HTML
    const renderedHTML = await renderMarkDown(articleMarkdownContent.content);
  
    return {
      props: {
        frontMatter: articleMarkdownContent.frontMatter,
        html: renderedHTML,
      },
    };
  };
  
  export const getStaticPaths: GetStaticPaths<ArticleProps> = async () => {
    const paths = fs
      .readdirSync(POSTS_PATH)
      .map((path) => path.replace(/\.md?$/, ''))
      .map((slug) => ({ params: { slug } }));
  
    return {
      paths,
      fallback: false,
    };
  };
  
  export default Article