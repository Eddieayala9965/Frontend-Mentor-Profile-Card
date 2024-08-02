"""Add name column to social_media_links with default value

Revision ID: 983a825d0726
Revises: 31c5c36fc530
Create Date: 2024-08-02 00:51:40.463821

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '983a825d0726'
down_revision: Union[str, None] = '31c5c36fc530'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
