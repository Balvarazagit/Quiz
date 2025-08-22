import './MediaUploader.css';

function MediaUploader({ qIndex, question, handleChange, handleFileUpload, extractYouTubeId }) {
  return (
    <div className="media-section">
      <label className="input-label">Add Media (Optional)</label>
      <div className="media-controls">
        <select
          value={question.mediaType}
          onChange={(e) => handleChange(qIndex, "mediaType", e.target.value)}
          className="media-type-select"
        >
          <option value="">No Media</option>
          <option value="image">Image</option>
          <option value="audio">Audio</option>
          <option value="gif">GIF</option>
          <option value="video">YouTube Video</option>
        </select>

        {question.mediaType === "image" && (
          <div className="media-upload">
            <label className="file-upload-btn">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, qIndex, "mediaUrl")}
                hidden
              />
            </label>
            {question.mediaUrl && <img src={question.mediaUrl} alt="preview" className="media-preview" />}
          </div>
        )}

        {question.mediaType === "audio" && (
          <div className="media-upload">
            <label className="file-upload-btn">
              Upload Audio
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileUpload(e, qIndex, "mediaUrl")}
                hidden
              />
            </label>
            {question.mediaUrl && (
              <audio controls className="media-audio">
                <source src={question.mediaUrl} type="audio/mpeg" />
              </audio>
            )}
          </div>
        )}

        {question.mediaType === "gif" && (
          <div className="media-upload">
            <label className="file-upload-btn">
              Upload GIF
              <input
                type="file"
                accept="image/gif"
                onChange={(e) => handleFileUpload(e, qIndex, "mediaUrl")}
                hidden
              />
            </label>
            {question.mediaUrl && <img src={question.mediaUrl} alt="gif" className="media-preview" />}
          </div>
        )}

        {question.mediaType === "video" && (
          <div className="media-upload">
            <input
              type="text"
              placeholder="Paste YouTube video URL"
              value={question.mediaUrl}
              onChange={(e) => handleChange(qIndex, "mediaUrl", e.target.value)}
              className="youtube-url-input"
            />
            {question.mediaUrl && (
              <iframe
                className="media-video"
                src={`https://www.youtube.com/embed/${extractYouTubeId(question.mediaUrl)}`}
                title="YouTube video"
                frameBorder="0"
                allowFullScreen
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MediaUploader;