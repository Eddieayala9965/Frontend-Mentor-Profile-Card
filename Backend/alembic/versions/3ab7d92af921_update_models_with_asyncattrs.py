"""Update models with AsyncAttrs

Revision ID: 3ab7d92af921
Revises: b1e032cffab1
Create Date: 2024-07-28 04:48:47.669505

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3ab7d92af921'
down_revision: Union[str, None] = 'b1e032cffab1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###
