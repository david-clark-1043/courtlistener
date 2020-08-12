# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2020-08-12 19:47
from __future__ import unicode_literals

import cl.lib.model_helpers
import cl.lib.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('people_db', '0044_noop_change_date_granularity_start'),
    ]

    operations = [
        migrations.AddField(
            model_name='financialdisclosure',
            name='sha1',
            field=models.CharField(blank=True, db_index=True, help_text=b'Unique ID for the document, as generated via SHA1 of the binary file', max_length=40),
        ),
        migrations.AlterField(
            model_name='financialdisclosure',
            name='filepath',
            field=models.FileField(db_index=True, help_text=b'The disclosure report itself', storage=cl.lib.storage.AWSMediaStorage(), upload_to=cl.lib.model_helpers.make_pdf_path),
        ),
        migrations.AlterField(
            model_name='financialdisclosure',
            name='thumbnail',
            field=models.FileField(blank=True, help_text=b'A thumbnail of the first page of the disclosure form', null=True, storage=cl.lib.storage.AWSMediaStorage(), upload_to=cl.lib.model_helpers.make_pdf_path),
        ),
    ]