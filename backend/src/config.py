from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # chuyển qua postgres => sử dụng được ondelete cascade :v
    # nếu không muốn thì comment lại dùng test.db => 1 số chức năng xoá sẽ không xoá những bản ghi liên quan
    DATABASE_URL: str = "postgresql://postgres:minhquan223@localhost:5432/db"
    # DATABASE_URL: str = "sqlite:///./test.db"

    SECRET_KEY: str = "your-secret-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()