"""Add patient intake fields

Revision ID: a2b3c4d5e6f7
Revises: 09adf265d46a
Create Date: 2026-07-03 09:38:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'a2b3c4d5e6f7'
down_revision: Union[str, None] = '09adf265d46a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add new patient intake columns (all nullable for backward compat)
    op.add_column('patients', sa.Column('height', sa.Float(), nullable=True))
    op.add_column('patients', sa.Column('weight', sa.Float(), nullable=True))
    op.add_column('patients', sa.Column('phone', sa.String(), nullable=True))
    op.add_column('patients', sa.Column('emergency_contact_relationship', sa.String(), nullable=True))
    op.add_column('patients', sa.Column('previous_surgeries', sa.JSON(), nullable=True))
    op.add_column('patients', sa.Column('family_medical_history', sa.JSON(), nullable=True))
    op.add_column('patients', sa.Column('smoking_status', sa.String(), nullable=True))
    op.add_column('patients', sa.Column('alcohol_consumption', sa.String(), nullable=True))
    op.add_column('patients', sa.Column('insurance_provider', sa.String(), nullable=True))
    op.add_column('patients', sa.Column('insurance_policy_number', sa.String(), nullable=True))
    op.add_column('patients', sa.Column('doctor_access_consent', sa.Boolean(), nullable=True, server_default='0'))
    op.add_column('patients', sa.Column('emergency_access_consent', sa.Boolean(), nullable=True, server_default='1'))
    op.add_column('patients', sa.Column('ai_analysis_consent', sa.Boolean(), nullable=True, server_default='0'))
    op.add_column('patients', sa.Column('profile_completed', sa.Boolean(), nullable=True, server_default='0'))


def downgrade() -> None:
    op.drop_column('patients', 'profile_completed')
    op.drop_column('patients', 'ai_analysis_consent')
    op.drop_column('patients', 'emergency_access_consent')
    op.drop_column('patients', 'doctor_access_consent')
    op.drop_column('patients', 'insurance_policy_number')
    op.drop_column('patients', 'insurance_provider')
    op.drop_column('patients', 'alcohol_consumption')
    op.drop_column('patients', 'smoking_status')
    op.drop_column('patients', 'family_medical_history')
    op.drop_column('patients', 'previous_surgeries')
    op.drop_column('patients', 'emergency_contact_relationship')
    op.drop_column('patients', 'phone')
    op.drop_column('patients', 'weight')
    op.drop_column('patients', 'height')
