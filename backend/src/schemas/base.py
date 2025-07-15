from pydantic import BaseModel, ConfigDict
from uuid import UUID


class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)
