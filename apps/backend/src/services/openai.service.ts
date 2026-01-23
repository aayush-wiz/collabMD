import OpenAI from "openai";
import {
  GitHubRepoInfo,
  RepoStructure,
} from "./github.service";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate comprehensive markdown documentation from GitHub repository data
 */
export async function generateMarkdownFromRepo(
  repoInfo: GitHubRepoInfo,
  structure: RepoStructure
): Promise<string> {
  // Build the prompt with repository information
  const prompt = buildPrompt(repoInfo, structure);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a technical documentation expert. Generate comprehensive, well-structured markdown documentation for GitHub repositories. Focus on clarity, completeness, and professional formatting.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const generatedMarkdown = completion.choices[0]?.message?.content;

    if (!generatedMarkdown) {
      throw new Error("Failed to generate markdown: empty response from OpenAI");
    }

    return generatedMarkdown.trim();
  } catch (error: any) {
    if (error.status === 401) {
      throw new Error("Invalid OpenAI API key");
    }
    if (error.status === 429) {
      throw new Error("OpenAI API rate limit exceeded");
    }
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

/**
 * Build the prompt for OpenAI
 */
function buildPrompt(
  repoInfo: GitHubRepoInfo,
  structure: RepoStructure
): string {
  const { owner, repo, description, stars, topics, languages } = repoInfo;

  // Format languages
  const languagesList = Object.keys(languages).join(", ") || "Not specified";

  // Format topics
  const topicsList = topics.length > 0 ? topics.join(", ") : "None";

  // Format key files content
  const keyFilesContent = structure.keyFiles
    .map((file) => {
      return `### ${file.path}\n\`\`\`\n${file.content}\n\`\`\``;
    })
    .join("\n\n");

  const prompt = `Generate comprehensive markdown documentation for the following GitHub repository.

**Repository Information:**
- Name: ${owner}/${repo}
- Description: ${description || "No description provided"}
- Stars: ${stars}
- Topics: ${topicsList}
- Primary Languages: ${languagesList}

**Repository Structure:**
\`\`\`
${structure.tree}
\`\`\`

**Key Files:**
${keyFilesContent || "No key files available"}

**Instructions:**
Generate a complete, professional README-style documentation that includes:

1. **Project Title and Description**
   - Clear, compelling project name and tagline
   - Brief overview of what the project does and why it exists

2. **Features**
   - Key features and capabilities
   - What makes this project unique or useful

3. **Technology Stack**
   - Programming languages used
   - Frameworks and libraries
   - Tools and dependencies

4. **Architecture Overview**
   - High-level architecture description
   - Main components and their roles
   - Project structure explanation

5. **Getting Started**
   - Prerequisites
   - Installation steps
   - Configuration requirements

6. **Usage**
   - How to run the project
   - Basic usage examples
   - Common use cases

7. **Code Analysis** (if applicable)
   - Key design patterns used
   - Notable implementations or approaches
   - Code organization principles

8. **Contributing** (optional)
   - Basic contribution guidelines if this appears to be an open-source project

9. **Additional Information**
   - Any other relevant details based on the repository content

**Important:**
- Format the output as clean, well-structured markdown
- Use proper markdown syntax (headings, lists, code blocks, etc.)
- Be comprehensive but concise
- Base the documentation on the actual files and structure provided
- If information is not available in the provided context, mention it briefly or skip that section
- Include code examples where relevant
- Make the documentation professional and ready-to-use

Generate the markdown documentation now:`;

  return prompt;
}
