# 📊 GitHub Repository Storyteller

<p align="center">
  <img src="https://github.com/lucide-icons/lucide/blob/main/icons/github.svg" width="120" height="120" alt="GitHub Logo" />
</p>

<p align="center">
  <b>Transform Your GitHub Repositories into Interactive Stories and Insights</b>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Live Demo</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## 🚀 Features

GitHub Repository Storyteller transforms any public GitHub repository into a compelling narrative, revealing the journey of your codebase through three powerful lenses:

### 📖 Repository Story
- Converts repository data into a readable narrative
- Highlights key milestones, contributors, and project evolution
- Presents the repository's history in an engaging format

### 👥 Contributor Insights
- Showcases all contributors with their avatars and contribution stats
- Recognizes the people behind the code
- Links directly to GitHub profiles

### 📈 Analytics Dashboard
- Real-time repository health score
- Pull request frequency metrics
- Issue resolution time analysis
- Interactive charts showing contribution distribution
- Actionable recommendations for repository improvement

## 🌟 Demo

Try the application with these popular repositories:

- [React](https://github.com/facebook/react)
- [Next.js](https://github.com/vercel/next.js)
- [TensorFlow](https://github.com/tensorflow/tensorflow)

Or enter any public GitHub repository URL to begin!

## 💻 Installation

### Prerequisites
- Node.js 16.8+ and npm/yarn
- A GitHub Personal Access Token (for higher API rate limits)

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/github-repository-storyteller.git
cd github-repository-storyteller
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Create a `.env.local` file in the project root with your GitHub token:
```
NEXT_PUBLIC_GITHUB_TOKEN=your_github_token_here
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Usage

1. Enter a GitHub repository URL in the format `https://github.com/owner/repo`
2. Click "Generate Story" to transform the repository data into a narrative
3. Navigate between the Story, Contributors, and Insights views
4. Explore interactive visualizations on the Insights page

## 📚 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with React 18
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **Data Visualization**: [ECharts](https://echarts.apache.org/) via echarts-for-react
- **API Integration**: GitHub REST API via Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Development**: TypeScript

## 📸 Screenshots

<table>
  <tr>
    <td>
      <img src="https://via.placeholder.com/400x225?text=Home+Page" alt="Home Page" />
      <p align="center"><em>Home Page</em></p>
    </td>
    <td>
      <img src="https://via.placeholder.com/400x225?text=Story+View" alt="Story View" />
      <p align="center"><em>Repository Story</em></p>
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://via.placeholder.com/400x225?text=Contributors" alt="Contributors" />
      <p align="center"><em>Contributors View</em></p>
    </td>
    <td>
      <img src="https://via.placeholder.com/400x225?text=Analytics" alt="Analytics" />
      <p align="center"><em>Insights Dashboard</em></p>
    </td>
  </tr>
</table>

## ✨ Key Features

- **Repository Storytelling**: Convert code repositories into engaging narratives
- **Interactive Visualizations**: Gain insights through beautiful charts and graphs
- **Repository Health Score**: Get an instant assessment of your repository's health
- **API Integration**: Seamless GitHub API integration with rate limit handling
- **Responsive Design**: Beautiful UI that works across all devices
- **Optimized Performance**: Fast loading times with dynamic imports and SSR
- **Accessibility**: Screen reader friendly with keyboard navigation support

## 🔍 How It Works

1. **Data Collection**: Fetches repository data from GitHub's REST API
2. **Story Generation**: Processes raw data into a meaningful narrative
3. **Insights Analysis**: Calculates metrics like PR frequency and issue resolution time
4. **Visualization**: Renders interactive charts to display repository metrics
5. **Recommendations**: Provides actionable insights based on repository analytics

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [GitHub REST API](https://docs.github.com/en/rest) for providing repository data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Next.js](https://nextjs.org/) team for the amazing framework
- All open-source contributors whose libraries made this project possible

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/yourusername">Your Name</a>
</p>