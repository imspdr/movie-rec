import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD

# Step 1: Load Preprocessed Data
movies_with_tags = pd.read_csv("filtered_movies.csv", encoding="utf-8")
corpus = movies_with_tags["words"]

# Step 2: TF-IDF Vectorization
tfidf = TfidfVectorizer(max_features=5000, stop_words="english")
tfidf_matrix = tfidf.fit_transform(corpus)
print(f"TF-IDF Matrix Shape: {tfidf_matrix.shape}")

# Step 3: Dimensionality Reduction with SVD
svd = TruncatedSVD(n_components=50, random_state=42)
movie_embeddings = svd.fit_transform(tfidf_matrix)
print(f"Reduced Embeddings Shape: {movie_embeddings.shape}")

# Step 4: Save Embeddings and Models
# Save embeddings
embeddings_df = pd.DataFrame(movie_embeddings, columns=[f"dim_{i}" for i in range(50)])
embeddings_df["id"] = movies_with_tags["id"]
embeddings_df.to_csv("movie_embeddings.csv", index=False)

# Save TF-IDF and SVD models using joblib
import joblib
joblib.dump(tfidf, "tfidf_model.joblib")
joblib.dump(svd, "svd_model.joblib")

print("Embeddings, TF-IDF model, and SVD model saved successfully.")
