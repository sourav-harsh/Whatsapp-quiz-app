from typing import Generic, TypeVar
from pydantic import BaseModel
from pydantic.generics import GenericModel
from typing import Union

T = TypeVar("T")


class ApiResponse(GenericModel, Generic[T]):
    success: bool
    data: Union[T, None] = None
    message: Union[str, None] = None
