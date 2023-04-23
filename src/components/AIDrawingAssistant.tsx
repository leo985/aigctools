import { Show, createSignal } from 'solid-js'

const AIDrawingAssistant = () => {
  let inputRef: HTMLTextAreaElement
  const [prompt, setPrompt] = createSignal('')
  const [generatedImage, setGeneratedImage] = createSignal('')
  const [loading, setLoading] = createSignal(false)

  async function generateImage() {
    if (!prompt() || typeof window === 'undefined') return
    setLoading(true)

    const response = await fetch('/api/draw', {
      method: 'POST',
      body: JSON.stringify({
        inputs: prompt(),
        options: {
          wait_for_model: false,
        },
      }),
    })
    if (!response.ok) {
      console.error('API 请求失败:', response.statusText)
      setLoading(false)
      return
    }
    const blob = await response.blob() // 将 ReadableStream 转换为 Blob
    const imageURL = URL.createObjectURL(blob)
    // eslint-disable-next-line no-console
    console.log('API 返回的数据:', imageURL)
    setGeneratedImage(imageURL)
    setLoading(false)
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.isComposing || e.shiftKey)
      return
    if (loading() === true)
      return
    if (e.key === 'Enter') {
      e.preventDefault()
      setPrompt((e.target as HTMLInputElement).value)
      generateImage()
    }
  }

  return (
    <div my-6>
      <div class="fi mt-2">
        <span class="gpt-title">绘画助手</span>
        <span class="gpt-subtitle">AI猫猫</span>
      </div>
      <Show
        when={!loading()}
        fallback={() => (
          <div class="gen-cb-wrapper">
            <span>AI is thinking...</span>
          </div>
        )}
      >
        <div class="gen-text-wrapper">
          <textarea
            ref={inputRef!}
            placeholder="请输入你的绘画提示..."
            onKeyDown={handleKeydown}
            autocomplete="off"
            autofocus
            onInput={(e) => {
              inputRef.style.height = 'auto'
              inputRef.style.height = `${inputRef.scrollHeight}px`
              setPrompt((e.target as HTMLTextAreaElement).value)
            }}
            rows="1"
            class="gen-textarea"
            value={prompt()}
          />
          <button onClick={() => generateImage()} gen-slate-btn>
            Send
          </button>
        </div>
      </Show>
      <div>
        {generatedImage() && <img src={generatedImage()} alt="生成的图片" />}
      </div>
    </div>)
}

export default AIDrawingAssistant
