import { useEffect, useState } from 'react'
import './App.css'

const EMPTY_FORM = {
  title: '',
  content: '',
}

function getSavedPosts() {
  const savedPosts = localStorage.getItem('blogPosts')

  if (!savedPosts) {
    return []
  }

  return JSON.parse(savedPosts)
}

function createPost(form) {
  const now = new Date()

  return {
    id: Date.now(),
    title: form.title.trim(),
    content: form.content.trim(),
    date: now.toLocaleDateString('ru-RU'),
    time: now.toLocaleTimeString('ru-RU'),
  }
}

function App() {
  const [posts, setPosts] = useState(getSavedPosts)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [postIdToEdit, setPostIdToEdit] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errorMessage, setErrorMessage] = useState('')
  const [postIdToDelete, setPostIdToDelete] = useState(null)

  useEffect(() => {
    localStorage.setItem('blogPosts', JSON.stringify(posts))
  }, [posts])

  function closeForm() {
    setIsFormOpen(false)
    setPostIdToEdit(null)
    setForm(EMPTY_FORM)
  }

  function openCreateForm() {
    setIsFormOpen(true)
    setPostIdToEdit(null)
    setForm(EMPTY_FORM)
  }

  function openEditForm(post) {
    setIsFormOpen(true)
    setPostIdToEdit(post.id)
    setForm({
      title: post.title,
      content: post.content,
    })
  }

  function handleTitleChange(event) {
    setForm({
      ...form,
      title: event.target.value,
    })
  }

  function handleContentChange(event) {
    setForm({
      ...form,
      content: event.target.value,
    })
  }

  function savePost() {
    const cleanTitle = form.title.trim()
    const cleanContent = form.content.trim()

    if (!cleanTitle || !cleanContent) {
      setErrorMessage('Заполните оба поля')
      return
    }

    if (postIdToEdit !== null) {
      setPosts(
        posts.map((post) =>
          post.id === postIdToEdit
            ? { ...post, title: cleanTitle, content: cleanContent }
            : post,
        ),
      )
    } else {
      const newPost = createPost({ title: cleanTitle, content: cleanContent })
      setPosts([newPost, ...posts])
    }

    closeForm()
  }

  function deletePost() {
    setPosts(posts.filter((post) => post.id !== postIdToDelete))
    setPostIdToDelete(null)
  }

  return (
    <div className="container">
      {errorMessage && (
        <div
          className="modal-overlay error-overlay"
          onClick={() => setErrorMessage('')}
        >
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <h2>Ошибка</h2>
            <p>{errorMessage}</p>
            <button className="btn-primary" onClick={() => setErrorMessage('')}>
              Понятно
            </button>
          </div>
        </div>
      )}

      {postIdToDelete !== null && (
        <div className="modal-overlay" onClick={() => setPostIdToDelete(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <h2>Удалить пост?</h2>
            <p>Это действие нельзя отменить</p>
            <div className="button-group">
              <button className="btn-delete" onClick={deletePost}>
                Удалить
              </button>
              <button className="btn-secondary" onClick={() => setPostIdToDelete(null)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content form-modal" onClick={(event) => event.stopPropagation()}>
            <h2>{postIdToEdit !== null ? 'Редактировать пост' : 'Новый пост'}</h2>

            <div className="form-group">
              <label htmlFor="title">Заголовок</label>
              <input
                id="title"
                type="text"
                value={form.title}
                placeholder="Введите заголовок"
                onChange={handleTitleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Описание</label>
              <textarea
                id="content"
                value={form.content}
                placeholder="Введите описание"
                onChange={handleContentChange}
              />
            </div>

            <div className="button-group">
              <button className="btn-primary" onClick={savePost}>
                {postIdToEdit !== null ? 'Сохранить' : 'Добавить'}
              </button>
              <button className="btn-secondary" onClick={closeForm}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="header">
        <h1>Мой блог</h1>
        <p>Добавляйте и редактируйте посты</p>
        <section className="toolbar">
          <button className="btn-primary add-button" onClick={openCreateForm}>
            Добавить пост
          </button>
        </section>
      </header>

      <section className="posts-section">
        <h2>Ваши посты: {posts.length}</h2>

        {posts.length === 0 ? (
          <div className="empty-state">
            Постов пока нет
          </div>
        ) : (
          <div className="posts-list">
            {posts.map((post) => (
              <article key={post.id} className="post-card">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-content">{post.content}</p>

                <div className="post-actions">
                  <button className="btn-delete" onClick={() => setPostIdToDelete(post.id)}>
                    Удалить
                  </button>
                  <button className="btn-primary" onClick={() => openEditForm(post)}>
                    Редактировать
                  </button>
                </div>

                <p className="post-date-time">
                  Добавлено {post.date} в {post.time}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
      <footer className="footer">
            <a href="https://t.me/bladasone">
              <i className="fab fa-telegram icon"></i></a>
      </footer>
    </div>
  )
}

export default App
