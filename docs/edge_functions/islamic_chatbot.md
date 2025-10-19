# Islamic Chatbot Edge Function Documentation

## Overview

This Supabase Edge Function provides an Islamic chatbot service that retrieves relevant Hadith from Pinecone vector database and generates contextual responses using AI. The function integrates multiple services to provide accurate, source-backed answers about Islamic teachings.

## Architecture

```
User Query → Google Text Embedding → Pinecone Vector Search → Groq AI Summary → Response
```

### Components:

* **Supabase Edge Function**: Main serverless function handler
* **Google Text Embedding API**: Converts text queries to 768-dimensional vectors
* **Pinecone Vector Database**: Stores and retrieves Hadith vectors
* **Groq AI (Llama3.1)**: Generates contextual responses from retrieved sources

## Features

* ✅ Multi-namespace support (Sahih Bukhari, Sahih Muslim, or both)
* ✅ Semantic search using 768-dimensional embeddings
* ✅ Top-K similarity-based retrieval
* ✅ AI-powered response generation with source attribution
* ✅ Comprehensive error handling and logging
* ✅ CORS support for web applications
* ✅ Respectful Islamic context and terminology

## Prerequisites

1. **Supabase Project** with Edge Functions enabled
2. **Pinecone Account** with vector database setup
3. **Google Cloud Account** with Generative AI API enabled
4. **Groq API Account** for language model access

## Installation

### 1\. Project Structure

Create the following file structure in your Supabase project:

```
supabase/functions/
├── \_shared/
│   └── cors.ts
└── islamic-chatbot/
    └── index.ts
```

### 2\. Environment Variables

Set the following environment variables in your Supabase project:

```bash
# Pinecone Configuration
PINECONE\_API\_KEY=your\_pinecone\_api\_key\_here
PINECONE\_HOST=https://hadith-xxxxx.svc.gcp-starter.pinecone.io

# Google API Configuration
GOOGLE\_API\_KEY=your\_google\_generative\_ai\_api\_key

# Groq API Configuration
GROQ\_API\_KEY=your\_groq\_api\_key
```

#### Getting API Keys:

**Pinecone:**

1. Sign up at [pinecone.io](https://pinecone.io)
2. Create an index named `hadith` with 768 dimensions
3. Get API key from dashboard
4. Find your host URL in the index details

**Google Generative AI:**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable the Generative Language API
3. Create an API key in Credentials section

**Groq:**

1. Sign up at [groq.com](https://groq.com)
2. Generate an API key from your dashboard

### 3\. Deploy the Function

```bash
# Deploy to Supabase
supabase functions deploy islamic-chatbot

# Verify deployment
supabase functions list
```

## Vector Database Setup

### Pinecone Index Configuration

* **Index Name**: `hadith`
* **Dimensions**: `768`
* **Metric**: `cosine`
* **Namespaces**:

  * `sahih\_bukhari`
  * `sahih\_muslim`

### Expected Metadata Structure

Each vector in Pinecone should have metadata in this format:

```json
{
  "text": "Full hadith text in Arabic/English",
  "book": "Sahih Bukhari" | "Sahih Muslim",
  "chapter": "Chapter name or number",
  "hadith\_number": "Hadith reference number",
  "narrator": "Name of the narrator"
}
```

## API Reference

### Endpoint

```
POST https://your-project.supabase.co/functions/v1/islamic-chatbot
```

### Headers

```http
Authorization: Bearer YOUR\_SUPABASE\_ANON\_KEY
Content-Type: application/json
```

### Request Body

```typescript
interface ChatbotRequest {
  query: string                                    // Required: User's question
  namespace?: 'sahih\_bukhari' | 'sahih\_muslim' | 'both'  // Optional: Default 'both'
  topK?: number                                   // Optional: Default 5, Max 10
}
```

### Response Format

```typescript
interface ChatbotResponse {
  answer: string                    // AI-generated response
  sources: Array<{
    id: string                     // Pinecone vector ID
    text: string                   // Full hadith text
    score: number                  // Similarity score (0-1)
    metadata: {
      book?: string                // Source book
      chapter?: string             // Chapter information
      hadith\_number?: string       // Reference number
      narrator?: string            // Narrator name
      namespace: string            // Source namespace
    }
  }>
  namespace\_used: string           // Namespace(s) queried
}
```

### Error Response

```typescript
interface ErrorResponse {
  error: string                    // Error message
  details?: string                 // Stack trace (development)
}
```

## Usage Examples

### Basic Query

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/islamic-chatbot' \\
  -H 'Authorization: Bearer YOUR\_ANON\_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "query": "What does Islam say about prayer?"
  }'
```

### Specific Namespace Query

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/islamic-chatbot' \\
  -H 'Authorization: Bearer YOUR\_ANON\_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "query": "Importance of charity in Islam",
    "namespace": "sahih\_bukhari",
    "topK": 3
  }'
```

### JavaScript/TypeScript Usage

```typescript
const response = await fetch('https://your-project.supabase.co/functions/v1/islamic-chatbot', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE\_ANON\_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: "What are the five pillars of Islam?",
    namespace: "both",
    topK: 5
  })
});

const data = await response.json();
console.log(data.answer);
console.log(data.sources);
```

## Configuration Options

### Performance Tuning

* **topK**: Adjust based on response quality vs speed (3-10 recommended)
* **Temperature**: Groq temperature is set to 0.3 for balanced creativity
* **Max Tokens**: Limited to 1024 for concise responses

### Namespace Strategy

* **'both'**: Searches both collections for comprehensive results
* **'sahih\_bukhari'**: Focuses on Bukhari collection only
* **'sahih\_muslim'**: Focuses on Muslim collection only

## Error Handling

The function handles various error scenarios:

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Query is required` | Empty or missing query | Provide valid query string |
| `Missing required environment variables` | API keys not set | Configure environment variables |
| `Failed to generate embedding` | Google API issues | Check API key and quota |
| `No relevant hadith found` | No vector matches | Try different query or lower similarity threshold |
| `Failed to generate response` | Groq API issues | Check API key and service status |

### Debug Mode

Enable detailed logging by checking Supabase function logs:

```bash
supabase functions logs islamic-chatbot
```

## Security Considerations

### API Keys

* Store all API keys as environment variables
* Never expose keys in client-side code
* Rotate keys regularly

### Rate Limiting

* Implement client-side rate limiting
* Consider adding server-side rate limiting for production
* Monitor API usage across all services

### Input Validation

* The function validates query input
* Sanitizes user inputs before processing
* Limits response size to prevent abuse

## Monitoring and Maintenance

### Key Metrics to Monitor

1. **Response Time**: Average function execution time
2. **Success Rate**: Percentage of successful requests
3. **API Usage**: Monitor quota usage for all integrated services
4. **Vector Quality**: Monitor similarity scores for relevance

### Maintenance Tasks

* **Monthly**: Review and update hadith data in Pinecone
* **Quarterly**: Update AI model versions if available
* **As Needed**: Rotate API keys for security

## Troubleshooting

### Common Issues

**Function Timeout:**

* Reduce topK value
* Check API service availability
* Optimize vector database queries

**Poor Response Quality:**

* Verify hadith metadata completeness
* Adjust Groq temperature settings
* Review embedding quality

**High API Costs:**

* Implement caching layer
* Optimize query frequency
* Consider batch processing

### Support Resources

* [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
* [Pinecone Vector Database Docs](https://docs.pinecone.io/)
* [Google Generative AI Documentation](https://ai.google.dev/)
* [Groq API Documentation](https://console.groq.com/docs)

## License and Usage

This function is designed for educational and religious purposes. When using this chatbot:

* Encourage users to consult qualified Islamic scholars for religious guidance
* Maintain respect for Islamic texts and teachings
* Provide appropriate disclaimers about AI-generated content
* Ensure compliance with local regulations regarding religious content

## Version History

* **v1.0**: Initial implementation with basic vector search and AI response
* Current version includes comprehensive error handling and multi-namespace support

For updates and improvements, refer to your project's git history or change log.