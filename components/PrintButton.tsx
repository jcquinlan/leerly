import React from 'react';
import { Button } from './styled';
import jsPDF from 'jspdf';
import 'fonts/addOpenSansRegular';
import 'fonts/addPoppinsRegular';
import { QuestionTypes } from 'types';

const PrintButton = ({article}) => {
    const handlePrint = () => {
        const SECTION_MARGIN = .5;
        const OPTION_MARGIN = .1;
        const QUESTION_INDENT = 1.4;
        const LINE_HEIGHT_FACTOR = 1.5;
        let y = 1;
        const doc = new jsPDF('p', 'in', [8.5, 11]);

        // ---------- METHODS -----------
        const renderHeader = () => {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            const title = 'leerly.io';
            const {h: height} = doc.getTextDimensions(title);

            doc.text(title, 6.5, 1);
            doc.text('Name: __________________________', 1, 1);

            y = y + height + 0.75;
        };

        const renderSpace = (size) => {
            const sizes = {
                small: .25,
                medium: SECTION_MARGIN,
                large: 1,
                huge: 3
            };

            y = y + sizes[size];
        };

        const getOptionsHeight = (options) => {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);

            return options.reduce((memo, option) => {
                const splitText = doc.splitTextToSize(option.text, 6.5); 
                const height = doc.getTextDimensions(splitText).h;

                return memo + height + OPTION_MARGIN;
            }, 0);
        };

        const renderTitle = (text) => {
            doc.setFont('Poppins-Regular', 'normal');
            doc.setFontSize(24);

            const splitTitle = doc.splitTextToSize(text, 6.5);
            const titleHeight = doc.getTextDimensions(splitTitle).h;

            if (y + titleHeight >= 8) {
                doc.addPage();
                y = 1;
            }

            doc.text(splitTitle, 1, y);

            y = y + titleHeight;
        };

        const renderText = (text) => {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);

            const splitText = doc.splitTextToSize(text, 6.5);

            for (let i = 0; i < splitText.length; i++) {
                const line = splitText[i];
                const lineHeight = doc.getTextDimensions(line).h;
                const emptyLineHeight = doc.getTextDimensions('a').h;

                if (y + lineHeight >= 10) {
                    doc.addPage();
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(12);
                    y = 1;
                }

                doc.text(line, 1, y);
                y = y + ((lineHeight || emptyLineHeight) * LINE_HEIGHT_FACTOR);
            }
        };

        const renderQuestion = (question, index) => {
            // Render Question Number
            doc.setFont('Poppins-Regular', 'normal');
            doc.setFontSize(16);
            const numberText = `${index + 1}.)`;
            const numberHeight = doc.getTextDimensions(numberText).h;
            const optionsHeight = question.type === QuestionTypes.MULTI_CHOICE ?
                getOptionsHeight(question.metadata.options) :
                0;

            if (y + numberHeight + optionsHeight >= 10) {
                doc.addPage();
                doc.setFont('Poppins-Regular', 'normal');
                doc.setFontSize(16);
                y = 1;
            }

            doc.setFont('Poppins-Regular', 'normal');
            doc.setFontSize(16);
            doc.text(numberText, 1, y);

            doc.setFontSize(12);

            const splitText = doc.splitTextToSize(question.text, 6.5 - QUESTION_INDENT);
            const lineHeight = doc.getTextDimensions(splitText).h;

            doc.text(splitText, QUESTION_INDENT, y - (lineHeight / 2));
            y = y + Math.max(numberHeight, lineHeight);

            // Render options for multiple choice
            if (question.type === QuestionTypes.MULTI_CHOICE) {
                doc.setFont('helvetica', 'normal');
                const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

                question.metadata?.options?.forEach((option, index) => {
                    const text = `${letters[index]}.) ${option.text}`;
                    const splitText = doc.splitTextToSize(text, 6.5 - QUESTION_INDENT);
                    const lineHeight = doc.getTextDimensions(splitText).h;

                    doc.text(splitText, QUESTION_INDENT, y);
                    y = y + lineHeight + OPTION_MARGIN;
                });
            }
            
        };

        // ---------- EXECUTION -----------
        doc.setLineHeightFactor(LINE_HEIGHT_FACTOR);
        renderHeader();
        renderTitle(article.title);
        renderSpace('medium')
        renderText(article.body);
        renderSpace('medium')

        if (article.questions?.length) {
            renderTitle('Questions');
            renderSpace('medium');
            article.questions.forEach((question, index) => {
                renderQuestion(question, index);
                const marginSize = question.type === QuestionTypes.MULTI_CHOICE ? 'large' : 'huge';
                renderSpace(marginSize);
            });
        }

        doc.autoPrint();
        doc.output('dataurlnewwindow');
    }

    return (
        <Button onClick={handlePrint}>Download article PDF</Button>
    )
}

export default PrintButton;