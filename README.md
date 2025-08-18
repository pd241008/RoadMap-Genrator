# 🚀 AI Roadmap Generator
An intelligent Next.js web application that generates personalized learning roadmaps for any topic using AI.
Users can input any subject and receive a comprehensive, structured learning path tailored to their goals.

## 🌟 Features
🎯 **AI-Powered Roadmap Generation** - Generate detailed learning paths for any topic
🧠 **Intelligent Structuring** - AI organizes content into logical learning phases
📚 **Comprehensive Coverage** - From beginner to advanced concepts
⚡ **Instant Generation** - Fast AI-powered responses
📱 **Fully Responsive Design** - Works seamlessly on all devices
🎨 **Clean Modern UI** - Beautiful, intuitive interface
🔄 **Topic Flexibility** - Support for any learning domain (tech, business, arts, etc.)

## 📂 Project Structure
```
├── app/                    # Next.js App Router pages and components
├──app/api                 # API Endpoint Connection for LLM APi 
├── components/            # Reusable UI components
├── public/               # Static assets
├── package.json          # Dependencies and scripts
└── README.md            # Project documentation
```

## 🛠️ Tech Stack
- **Next.js 15** – React framework for SSR and routing
- **TailwindCSS** – Utility-first styling framework
- **TypeScript** – Type safety and better development experience
- **Gemini 1.5 Flash LLM API** – Intelligent roadmap generation powered by Google's AI
- **Vercel** – Deployment and hosting platform

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/pd241008/RoadMap-Genrator.git
cd RoadMap-Genrator
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file and add your AI service API keys:
```env
# Add your AI service API key here
OPENAI_API_KEY=your_api_key_here
# or other AI service credentials
```

### 4. Run the development server
```bash
npm run dev
```

### 5. Open in browser
Navigate to (```http://localhost:3000```)

## 🚀 Usage

1. **Enter a Topic**: Type any subject you want to learn (e.g., "Data Science", "Web Development", "Digital Marketing")
2. **Generate Roadmap**: Click the "Generate" button to create your personalized learning path
3. **Follow the Path**: Receive a structured roadmap with phases, milestones, and resources
4. **Customize**: Modify or regenerate roadmaps based on your specific needs

## 🎯 Example Topics
- **Technology**: Python Programming, Machine Learning, Cloud Computing
- **Business**: Digital Marketing, Project Management, Entrepreneurship
- **Creative**: UI/UX Design, Photography, Content Writing
- **Academic**: Mathematics, Physics, Literature
- **Skills**: Public Speaking, Leadership, Time Management

## 🌐 API Usage
The application may expose API endpoints for programmatic roadmap generation:

### Endpoint:
```
POST /api/generate-roadmap
```

### Request Body:
```json
{
  "topic": "Machine Learning",
  "level": "beginner",
  "timeframe": "6 months"
}
```

### Response:
```json
{
  "roadmap": {
    "title": "Machine Learning Learning Path",
    "phases": [...],
    "estimated_duration": "6 months",
    "resources": [...]
  }
}
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the (`LICENSE`) file for details.

## 🔗 Links
- **Live Demo**: (```https://road-map-genrator.vercel.app/```)
- **GitHub Repository**:(```https://github.com/pd241008/RoadMap-Genrator```)


