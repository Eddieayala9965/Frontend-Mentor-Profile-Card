"""Add name column to social_media_links with default value again

Revision ID: 47a63dcc6115
Revises: 983a825d0726
Create Date: 2024-08-02 00:54:43.645571

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '47a63dcc6115'
down_revision: Union[str, None] = '983a825d0726'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
